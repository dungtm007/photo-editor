package photoeditor.listeners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import photoeditor.services.TokenService;

@WebListener
public class PhotoEditorContextListener implements ServletContextListener {

	@Autowired
	private TokenService tokenService;
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, sce.getServletContext());
		System.out.println("Servlet Context is initialized....");
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		tokenService.deleteAllInBatch();
		System.out.println("Servlet Context is destroyed....");
	}
	
}
