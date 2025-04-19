package io.getaway.server.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import io.getaway.server.model.Server;

public interface  ServerRepo extends JpaRepository<Server, Long>{
    Server findByIpAddress(String ipAddress);
    //Server findByIpName(String name);

    
}
