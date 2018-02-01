package photoeditor.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import photoeditor.domainclasses.User;
import photoeditor.services.UserService;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	@Autowired
    private UserService userService;
	
    public UserServlet() {
        super();
    }
    
    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
        //https://stackoverflow.com/questions/43654488/spring-boot-inject-bean-into-httpservlet
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter writer = response.getWriter();
		writer.write("User Servlet");
	}
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String oauthProvider = request.getParameter("oauthProvider");
		String oauthUid = request.getParameter("oauthUid");
		String displayName = request.getParameter("displayName");
		String email = request.getParameter("email");
		String photoUrl = request.getParameter("photoUrl");
	
		User user = userService.findByOauthUid(oauthUid);
		if(user == null) 
		{
			user = new User(oauthProvider, oauthUid, displayName, email, photoUrl);
			userService.save(user);
		}
		
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");	
		
		//ServletOutputStream out = response.getOutputStream();
		PrintWriter writer = response.getWriter();

		JSONObject json = null;
		try {
			json = new JSONObject("{'result':'Success', 'userId':'" + user.getId() + "'}");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		writer.print((json == null) ? "Error" : json.toString());
	}

}
