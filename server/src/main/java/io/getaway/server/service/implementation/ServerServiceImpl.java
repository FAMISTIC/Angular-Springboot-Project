package io.getaway.server.service.implementation;

import java.io.IOException;
import java.net.InetAddress;
import java.util.Collection;
import java.util.Random;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import io.getaway.server.enumeration.Status;
import io.getaway.server.model.Server;
import io.getaway.server.repo.ServerRepo;
import io.getaway.server.service.ServerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class ServerServiceImpl implements ServerService{

    private final ServerRepo serverRepo;
    

    @Override
    public Server create(Server server) {
        log.info("Saving new server:", server.getName());
        server.setImageURL(setServerImageUrl());
        return serverRepo.save(server);
    }

    @Override
    public Server ping(String ipAddress) throws IOException{
        log.info("Pinging server IP: {}", ipAddress);
        Server server = serverRepo.findByIpAddress(ipAddress);
        InetAddress address = InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(10000) ? Status.SERVER_UP :Status.SERVER_DOWN);
        serverRepo.save(server);
        return server;
    }

    @Override
    public Boolean delete(Long id) {
        log.info("Deleting server: by ID{}", id);
        serverRepo.deleteById(id);
        return Boolean.TRUE;
    }

    @Override
    public Server get(Long id) {
        log.info("Fetching servers by id; {}", id);
        return serverRepo.findById(id).get();
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Fethcing all servers");
        return serverRepo.findAll(PageRequest.of(0, limit)).toList();
    }

    @Override
    public Server update(Server server) {
        log.info("Updating new server:{}", server.getName());
        return serverRepo.save(server);
    }

    private String setServerImageUrl(){
        String[] imageNames = { "server1.png", "server2.png", "server3.png", "server4.png" };
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/server/image/" + imageNames[new Random().nextInt(4)]).toUriString();
    }
    
}
