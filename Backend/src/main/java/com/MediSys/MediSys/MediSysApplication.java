package com.MediSys.MediSys;

import com.MediSys.MediSys.config.FileStorageConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MediSysApplication {

	public static void main(String[] args) {
		FileStorageConfig.init();
		SpringApplication.run(MediSysApplication.class, args);
	}

}
