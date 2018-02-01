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
import photoeditor.services.PhotoService;
import photoeditor.services.UserService;

@WebServlet("/photo")
public class PhotoServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Autowired
    private PhotoService photoService;
	
    public PhotoServlet() {
        super();
    }
    
    @Override
    public void init() throws ServletException {
        SpringBeanAutowiringSupport.processInjectionBasedOnServletContext(this, getServletContext());
        //https://stackoverflow.com/questions/43654488/spring-boot-inject-bean-into-httpservlet
    }
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		int userId = Integer.parseInt(request.getParameter("userId"));
		int photoId = Integer.parseInt(request.getParameter("photoId"));
		String photoTitle = request.getParameter("photoTitle");
		String imageBase64 = request.getParameter("imageData");
		
		byte[] imageData = Base64.getDecoder().decode(imageBase64);
		
		//Photo photo = new Photo(userId, imageData);
		Photo photo = photoService.find(photoId);
		if (photo == null) {
			photo = new Photo(userId, imageData, photoTitle);
		}
		else {
			photo.setImageData(imageData);
		}
		photoService.save(photo);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("utf-8");	
		
		PrintWriter writer = response.getWriter();

		JSONObject json = null;
		try {
			json = new JSONObject("{'result':'Success', 'photoId':'" + photo.getId() + "'}");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		writer.print((json == null) ? "Error" : json.toString());
		
	}

}
