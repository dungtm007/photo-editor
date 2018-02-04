package photoeditor.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Base64;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import photoeditor.domainclasses.Photo;
import photoeditor.domainclasses.Token;
import photoeditor.services.PhotoService;
import photoeditor.services.TokenService;
import photoeditor.services.UserService;
import photoeditor.utilities.TokenValidator;

@WebServlet("/photo")
public class PhotoServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Autowired
    private PhotoService photoService;
	
	@Autowired
	private TokenService tokenService;
	
    public PhotoServlet() {
        super();
    }
    
    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
        //https://stackoverflow.com/questions/43654488/spring-boot-inject-bean-into-httpservlet
    }
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");	
		String errorMsg = "";
		PrintWriter writer = response.getWriter();
		
		int userId = Integer.parseInt(request.getParameter("userId"));
		String token = request.getParameter("token");
		
		// Validate authorization
		Token activeToken = tokenService.findByToken(token);
		if (activeToken == null ||
				!activeToken.isActive() ||
				activeToken.getUserId() != userId || 
				!TokenValidator.validate(activeToken, request) || 
				!TokenValidator.verifyTokenFromFirebase(activeToken.getToken())) {
			errorMsg = "Unauthorized or Invalid token";
			writer.print("{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }");
			return;
		}
		
		int photoId = Integer.parseInt(request.getParameter("photoId"));
		String photoTitle = request.getParameter("photoTitle");
		String imageBase64 = request.getParameter("imageData");
		
		//byte[] imageData = Base64.getDecoder().decode(imageBase64);
		
		Photo photo = photoService.find(photoId);
		if (photo == null) {
			photo = new Photo(userId, imageBase64, photoTitle);
		}
		else {
			photo.setImageData(imageBase64);
		}
		photoService.save(photo);

		JSONObject json = null;
		try {
			json = new JSONObject("{'result':'Success', 'photoId':'" + photo.getId() + "'}");
		} catch (JSONException e) {
			errorMsg = "Cannot parse result";
			e.printStackTrace();
		}
		writer.print((json == null) ? "{ \"result\":\"Error\", \"error\":\"" + errorMsg + "\" }" : json.toString());
		
	}

}
