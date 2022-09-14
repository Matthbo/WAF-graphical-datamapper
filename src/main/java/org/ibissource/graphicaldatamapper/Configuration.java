package org.ibissource.graphicaldatamapper;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.web.context.ServletContextAware;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletRegistration;

@org.springframework.context.annotation.Configuration
public class Configuration implements ServletContextAware {
    private ServletContext _servletContext;

    @Bean
    @Scope("singleton")
    public void frontend(){
//        AngularServlet frontendServlet = new AngularServlet();
//        frontendServlet.
        ServletRegistration.Dynamic frontendReg = _servletContext.addServlet("frontend", AngularServlet.class);
//        frontendReg.setLoadOnStartup(2);
        frontendReg.addMapping("/*");
    }

    @Bean
    @Scope("singleton")
    public void backend(){
//        DispatcherServlet servlet = new DispatcherServlet(context);
        ServletRegistration.Dynamic backendReg = _servletContext.addServlet("backend", DispatcherServlet.class);
//        backendReg.setLoadOnStartup(1);
        backendReg.addMapping("/api/*");
    }

    @Override
    public void setServletContext(ServletContext servletContext) {
        this._servletContext = servletContext;
    }
}
