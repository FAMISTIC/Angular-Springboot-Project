package io.getaway.server.resource;

import static java.time.LocalDateTime.now;
import static  org.springframework.http.HttpStatus.OK;
import static  org.springframework.http.HttpStatus.CREATED;
import static java.util.Map.of;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;



import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.getaway.server.enumeration.Status;
import io.getaway.server.model.Response;
import io.getaway.server.model.Server;
import io.getaway.server.service.implementation.ServerServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/server")
@RequiredArgsConstructor
public class ServerResource {
    private final ServerServiceImpl serverService;


    @GetMapping("/list")
    public ResponseEntity<Response>getServers() throws InterruptedException{
        TimeUnit.SECONDS.sleep(3);
        /*throw new InterruptedException("Something went wrong");*/
            return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(of("servers", serverService.list(30)))
            .message("Servers retrieved")
            .status(OK)
            .statusCode(OK.value())
            .build()
            );
    }

    @GetMapping("/ping/{ipAddress}")
    public ResponseEntity<Response> pingServer(@PathVariable("ipAddress") String ipAddress) throws IOException{
        Server server = serverService.ping(ipAddress);
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(of("server", server))
            .message(server.getStatus() == Status.SERVER_UP ? "Ping success" : "Ping failed")
            .status(OK)
            .statusCode(OK.value())
            .build()
            );
    }

    @PostMapping("/save")
    public ResponseEntity<Response>saveServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(of("server", serverService.create(server)))
            .message("Server created")
            .status(CREATED)
            .statusCode(CREATED.value())
            .build()
            );
    }

    @PostMapping("/get/{id}")
    public ResponseEntity<Response>getServer(@PathVariable("id") Long id){
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(of("server", serverService.get(id)))
            .message("Server retrieved")
            .status(OK)
            .statusCode(OK.value())
            .build()
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteServer(@PathVariable("id") Long id){
        return ResponseEntity.ok(
            Response.builder()
            .timeStamp(now())
            .data(of("deleted", serverService.delete(id)))
            .message("Server deleted")
            .status(OK)
            .statusCode(OK.value())
            .build()
        );
    }

    @GetMapping(path = "/image/{filename}", produces = IMAGE_PNG_VALUE)
    public byte[] getServerImage(@PathVariable("filename") String filename) throws IOException{
        return Files.readAllBytes(Paths.get(System.getProperty("user.home") + "/Downloads/images/" +filename));
    }
}
