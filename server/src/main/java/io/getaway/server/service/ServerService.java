package io.getaway.server.service;

import java.io.IOException;
import java.util.Collection;

import io.getaway.server.model.Server;

public interface ServerService {
    Server create(Server server);
    Server ping(String ipAdress) throws IOException;
    Collection<Server> list(int limit);
    Server get(Long id);
    Server update(Server server);
    Boolean delete(Long id);
}
