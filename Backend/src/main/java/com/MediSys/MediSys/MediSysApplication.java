package com.MediSys.MediSys;

import com.MediSys.MediSys.config.FileStorageConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MediSysApplication {

	public static void main(String[] args) {
		FileStorageConfig.init();
		SpringApplication.run(MediSysApplication.class, args);
	}

}
