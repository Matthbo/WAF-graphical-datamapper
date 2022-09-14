package org.ibissource.graphicaldatamapper;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.*;
import javax.servlet.annotation.WebListener;

public class SpringWebApplicationInitializer implements WebApplicationInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(Configuration.class);
        context.setServletContext(servletContext);

        ServletRegistration.Dynamic servlet = servletContext.addServlet("dispatcher", new DispatcherServlet(context));
        servlet.setLoadOnStartup(1);
        servlet.addMapping("/api/*");
    }
}

/*@WebListener
public class SpringWebApplicationInitializer implements ServletContextListener {
    private AnnotationConfigWebApplicationContext context;

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        ServletContext servletContext = servletContextEvent.getServletContext();

        context = new AnnotationConfigWebApplicationContext();

        WebApplicationContext parentApplicationContext = WebApplicationContextUtils.getWebApplicationContext(servletContext);
        if(parentApplicationContext != null) {
            context.setParent(parentApplicationContext);
        }

        *//*DispatcherServlet servlet = new DispatcherServlet(context);
        ServletRegistration.Dynamic backendReg = _servletContext.addServlet("backend", servlet);
        backendReg.setLoadOnStartup(1);
        backendReg.addMapping("/api/*");*//*

        context.setDisplayName("Graphical-Datamapper");
        context.register(Configuration.class);
        context.setServletContext(servletContext);
        context.refresh();
    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        context.close();
    }
}*/
