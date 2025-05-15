package com.MediSys.MediSys.auth.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Value("${jwt.header.string}")
    private String HEADER_STRING;

    @Value("${jwt.token.prefix}")
    private String TOKEN_PREFIX;

    private final UserDetailsService userDetailsService;
    private final UnauthorizedEntryPoint unauthorizedEntryPoint;
    private final TokenProvider tokenProvider;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, TokenProvider tokenProvider, UnauthorizedEntryPoint unauthorizedEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.tokenProvider = tokenProvider;
        this.unauthorizedEntryPoint = unauthorizedEntryPoint;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.startsWith("/api/auth/") || path.equals("/api/doctors")
        ) {
            filterChain.doFilter(request, response);
            return;
        }
        String header = request.getHeader(HEADER_STRING);
        String username = null;
        String authToken = null;
        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authToken = header.replace(TOKEN_PREFIX, "").trim();
            try {
                username = tokenProvider.getUsernameFromToken(authToken);
            } catch (IllegalArgumentException e) {
                logger.error("An error occurred while trying to retrieve the username from token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("The token is expired", e);
                unauthorizedEntryPoint.commence(request, response, null);
            } catch (SignatureException e) {
                logger.error("Authentication failed", e);
            }
        }
        else{
            logger.warn("Authorization header not found");
        }
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            try{
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if(tokenProvider.validateToken(authToken,userDetails)){
                    UsernamePasswordAuthenticationToken authentication = tokenProvider.getAuthenticationToken
                            (authToken,SecurityContextHolder.getContext().getAuthentication(), userDetails);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
            catch(Exception e){
                logger.error("An error occurred while trying to authenticate user", e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            }
        }
        filterChain.doFilter(request, response);
    }
}
