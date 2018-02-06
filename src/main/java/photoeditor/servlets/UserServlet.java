package photoeditor.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

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
    
    private void doSignIn(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
		String fbToken = request.getParameter("fbToken");
		
		// Validate token validity according to Firebase
		if (!TokenValidator.verifyTokenFromFirebase(token)) {
			errorMsg = "Unauthorized or Invalid token";
			writer.print("{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }");
			return;
		}
		
		User user = userService.findByOauthUid(oauthUid);
		List<Token> activeTokens = tokenService.findByToken(token);
		Token activeToken = (activeTokens != null && activeTokens.size() > 0) ? activeTokens.get(0) : null;
		
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
		
		if (request.getSession(false) == null) {
			request.getSession();
		}
		
		request.getSession(false).setAttribute("userId", user.getId());
		if (fbToken != null && !fbToken.isEmpty()) {
			request.getSession(false).setAttribute("fbToken", fbToken);	
		}

		JSONObject json = null;
		try {
			Object fbTokenObj = request.getSession(false).getAttribute("fbToken"); 
			fbToken = fbTokenObj != null ? fbTokenObj.toString() : "";
			json = new JSONObject("{ 'result':'Success', 'userId':'" + user.getId() + "', 'fbToken':'" + fbToken + "' }");
		} catch (JSONException e) {
			errorMsg = "Cannot parse result";
			e.printStackTrace();
		}
		writer.print((json == null) ? "{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }" : json.toString());
    }
    
    private void doSignOut(HttpServletRequest request, HttpServletResponse response) throws IOException {
    	
    	// Kill session
    	HttpSession session = request.getSession(false);
    	session.invalidate();
    	
    	response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");	
		String errorMsg = "";
		PrintWriter writer = response.getWriter();
		
		// Verify 
		int userId = Integer.parseInt(request.getParameter("userId"));
		String token = request.getParameter("token");
		
		// Validate authorization
		List<Token> activeTokens = tokenService.findByToken(token);
		Token activeToken = (activeTokens != null && activeTokens.size() > 0) ? activeTokens.get(0) : null;
		
		if (activeToken == null ||
				!activeToken.isActive() ||
				activeToken.getUserId() != userId || 
				!TokenValidator.validate(activeToken, request) || 
				!TokenValidator.verifyTokenFromFirebase(activeToken.getToken())) {
			errorMsg = "Unauthorized or Invalid token";
			writer.print("{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }");
			return;
		}
		
		tokenService.deleteInBatch(activeTokens);
		
		JSONObject json = null;
		try {
			json = new JSONObject("{ 'result':'Success' }");
		} catch (JSONException e) {
			errorMsg = "Cannot parse result";
			e.printStackTrace();
		}
		writer.print((json == null) ? "{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }" : json.toString());
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String action = request.getParameter("action");
		if(action != null) {
			if(action.toUpperCase().equals("SIGNIN")) {
				doSignIn(request, response);
			} else if(action.toUpperCase().equals("SIGNOUT")) {
				doSignOut(request, response);
			}
		}
	}
}
