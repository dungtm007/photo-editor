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

import photoeditor.domainclasses.Token;
import photoeditor.domainclasses.User;
import photoeditor.services.TokenService;
import photoeditor.services.UserService;
import photoeditor.utilities.HeaderParser;
import photoeditor.utilities.TokenValidator;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	@Autowired
    private UserService userService;
	
	@Autowired 
	private TokenService tokenService;
	
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
		
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");
		String errorMsg = "";
		PrintWriter writer = response.getWriter();
		
		String oauthProvider = request.getParameter("oauthProvider");
		String oauthUid = request.getParameter("oauthUid");
		String displayName = request.getParameter("displayName");
		String email = request.getParameter("email");
		String photoUrl = request.getParameter("photoUrl");
		String token = request.getParameter("token");
		
		// Validate token validity according to Firebase
		if (!TokenValidator.verifyTokenFromFirebase(token)) {
			errorMsg = "Unauthorized or Invalid token";
			writer.print("{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }");
			return;
		}
		
		User user = userService.findByOauthUid(oauthUid);
		Token activeToken = tokenService.findByToken(token);
		
		if(user == null) { // new user, new token
			user = new User(oauthProvider, oauthUid, displayName, email, photoUrl);
			userService.save(user);
			activeToken = new Token(user.getId(), token, true);
			activeToken.setOs(HeaderParser.getOs(request));
			activeToken.setBrowser(HeaderParser.getBrowser(request));
			activeToken.setIp(HeaderParser.getIp(request));
			tokenService.save(activeToken);
		}
		else { // existed user, update new token if needed
			if (activeToken != null) {
				if (activeToken.getUserId() != user.getId() || !TokenValidator.validate(activeToken, request)) {
					errorMsg = "Unauthorized or Invalid token";
					writer.print("{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }");
					return;
				}
			}
			else {
				activeToken = new Token(user.getId(), token, true);
				activeToken.setOs(HeaderParser.getOs(request));
				activeToken.setBrowser(HeaderParser.getBrowser(request));
				activeToken.setIp(HeaderParser.getIp(request));
				tokenService.save(activeToken);
			}
		}
		
		JSONObject json = null;
		try {
			json = new JSONObject("{ 'result':'Success', 'userId':'" + user.getId() + "' }");
		} catch (JSONException e) {
			errorMsg = "Cannot parse result";
			e.printStackTrace();
		}
		writer.print((json == null) ? "{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }" : json.toString());
	}

}
