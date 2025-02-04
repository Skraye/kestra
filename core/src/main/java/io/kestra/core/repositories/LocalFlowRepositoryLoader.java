package io.kestra.core.repositories;

import lombok.extern.slf4j.Slf4j;
import io.kestra.core.models.flows.Flow;
import io.kestra.core.serializers.YamlFlowParser;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.*;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import org.apache.commons.io.FileUtils;

import javax.validation.ConstraintViolationException;

import static io.kestra.core.utils.Rethrow.throwConsumer;

@Singleton
@Slf4j
public class LocalFlowRepositoryLoader {
    @Inject
    private YamlFlowParser yamlFlowParser;

    @Inject
    private FlowRepositoryInterface flowRepository;

    public void load(URL basePath) throws IOException, URISyntaxException {
        URI uri = basePath.toURI();

        if (uri.getScheme().equals("jar")) {
            try (FileSystem fileSystem = FileSystems.newFileSystem(uri, Collections.emptyMap())) {
                String substring = uri.toString().substring(uri.toString().indexOf("!") + 1);

                Path tempDirectory = Files.createTempDirectory("loader");

                for (Path path1 : fileSystem.getRootDirectories()) {
                    Files
                        .walk(path1)
                        .filter(path -> Files.isRegularFile(path) && path.startsWith(substring))
                        .forEach(throwConsumer(path -> FileUtils.copyURLToFile(
                            path.toUri().toURL(),
                            tempDirectory.resolve(path.toString().substring(1)).toFile())
                        ));
                }

                this.load(tempDirectory.toFile());
            }
        } else {
            this.load(Paths.get(uri).toFile());
        }
    }

    public void load(File basePath) throws IOException {
        List<Path> list = Files.walk(basePath.toPath())
            .filter(YamlFlowParser::isValidExtension)
            .collect(Collectors.toList());

        for (Path file: list) {
            try {
                Flow parse = yamlFlowParser.parse(file.toFile());
                flowRepository.create(parse);
                log.trace("Created flow {}.{}", parse.getNamespace(), parse.getId());
            } catch (ConstraintViolationException e) {
                log.warn("Unable to create flow {}", file, e);
            }
        }
    }
}
