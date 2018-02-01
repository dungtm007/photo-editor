package photoeditor.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import photoeditor.domainclasses.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Integer> {
	List<Photo> findByUserId(int userId);
}
