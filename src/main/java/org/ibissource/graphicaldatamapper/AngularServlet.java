package org.ibissource.graphicaldatamapper;

import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

public class AngularServlet extends HttpServlet {

    private final Logger log = LogManager.getLogger(this);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String path = req.getPathInfo();
        log.info("Requested path:" + path);
        if(path == null)
            path = "/index.html";
        if(path.equals("/")) {
            path += "index.html";
        }

        URL resource = this.getClass().getResource("/frontend"+path);

        if(resource == null) {
            resp.sendError(404, "file not found");
            return;
        }
        log.info(resource.toString());

//        MediaType mimeType = MimeTypeUtil.determineFromPathMimeType(path);
        String contentType = Files.probeContentType(Path.of(path));
        if(contentType != null && !contentType.equals("")) {
            resp.setContentType(contentType);
        }

        try(InputStream in = resource.openStream()) {
//            Files.copy(Path.of(resource.getPath()), resp.getOutputStream());
            IOUtils.copy(in, resp.getOutputStream());
        } catch (IOException e) {
            resp.sendError(500, e.getMessage());
            return;
        }

        resp.flushBuffer();
    }
}
