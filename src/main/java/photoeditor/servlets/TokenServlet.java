package photoeditor.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import photoeditor.domainclasses.Token;
import photoeditor.services.TokenService;
import photoeditor.utilities.TokenValidator;

@WebServlet("/token")
public class TokenServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	@Autowired
	private TokenService tokenService;
	
    public TokenServlet() {
        super();
    }

    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
        //https://stackoverflow.com/questions/43654488/spring-boot-inject-bean-into-httpservlet
    }
    
    // it should be doDelete, but it does not suppport getParameter as Key-Value
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");	
		String errorMsg = "";
		PrintWriter writer = response.getWriter();
		
		// Verify 
		int userId = Integer.parseInt(request.getParameter("userId"));
		String token = request.getParameter("token");
		String action = request.getParameter("action");
		
		if (!action.toUpperCase().equals("DELETE")) {
			errorMsg = "Not supported action";
			writer.print("{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }");
			return;
		}
		
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

}
