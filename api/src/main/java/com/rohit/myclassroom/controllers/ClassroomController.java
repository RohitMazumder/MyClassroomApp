package com.rohit.myclassroom.controllers;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rohit.myclassroom.models.Classroom;
import com.rohit.myclassroom.models.User;
import com.rohit.myclassroom.payload.request.CreateClassroomRequest;
import com.rohit.myclassroom.payload.request.EditUserPermissionRequest;
import com.rohit.myclassroom.payload.response.CreateClassroomResponse;
import com.rohit.myclassroom.payload.response.GetUserPermissionsResponse;
import com.rohit.myclassroom.payload.response.MessageResponse;
import com.rohit.myclassroom.payload.response.MessageResponseConstants;
import com.rohit.myclassroom.repository.ClassroomRepository;
import com.rohit.myclassroom.repository.UserRepository;
import com.rohit.myclassroom.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classroom")
public class ClassroomController {
	
	@Autowired
	ClassroomRepository classroomRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@PostMapping("/create")
	public ResponseEntity<?> createClassroom(@Valid @RequestBody CreateClassroomRequest createClassroomRequest,
											 @AuthenticationPrincipal UserDetailsImpl userDetails) {
		Classroom classroom = new Classroom(createClassroomRequest.getName(), createClassroomRequest.getDescription());
		User admin = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User Id not found"));
		classroom.setAdmin(admin);
		classroomRepository.save(classroom);
		return ResponseEntity.ok(new CreateClassroomResponse(classroom.getUid()));
	}
	
	@DeleteMapping("/delete/{classroomUid}")
	public ResponseEntity<?> deleteClassroom(@PathVariable String classroomUid, 
                                             @AuthenticationPrincipal UserDetailsImpl userDetails){
		Classroom classroom = classroomRepository.findByUid(classroomUid)
		                                         .orElseThrow(() -> new RuntimeException("Classroom Uid not found"));
		if(classroom.getAdmin().getId() != userDetails.getId()){
			return ResponseEntity.badRequest().body(MessageResponseConstants.USER_HAVE_NO_PERMISSION);
		}
		classroomRepository.delete(classroom);
		return ResponseEntity.ok(new MessageResponse(MessageResponseConstants.CLASSROOM_DELETED_SUCCESSFULLY));
	}
		
	@GetMapping("/createdClassrooms")
	public List<Classroom> getClassroomByUserId(@AuthenticationPrincipal UserDetailsImpl userDetails){
		return classroomRepository.findByAdminId(userDetails.getId());
	}
	
	@PutMapping("/updateUserPermissions")
	public ResponseEntity<?> editUserPermissions(@Valid @RequestBody EditUserPermissionRequest editUserPermissionRequest,
			                                     @AuthenticationPrincipal UserDetailsImpl userDetails) {
		Classroom classroom = classroomRepository.findByUid(editUserPermissionRequest.getClassroomUid())
				                                 .orElseThrow(() -> new RuntimeException("Classroom uid not found"));
		if(classroom.getAdmin().getId() != userDetails.getId()){
			return ResponseEntity.badRequest().body(MessageResponseConstants.USER_HAVE_NO_PERMISSION);
		}
		
		if(editUserPermissionRequest.getAllowAll()) {
			classroom.setAllowAll(true);
		} else {
			Set<User> permittedUsers = retrievePermittedUsersFromUsernames(editUserPermissionRequest.getPermittedUsernames());
			classroom.setPermittedUsers(permittedUsers);			
			classroom.setAllowAll(false);
		}
		
		classroomRepository.save(classroom);
		return ResponseEntity.ok(new MessageResponse(MessageResponseConstants.PERMISSIONS_UPDATED_SUCCESSFULLY));
	}
	
	private Set<User> retrievePermittedUsersFromUsernames(List<String> usernames){
		Set<User> permittedUsers = new HashSet<>();
		for(String username: usernames){
			permittedUsers.add(userRepository.findByUsername(username)
					      .orElseThrow(() -> new RuntimeException("Username not found")));
		}
		return permittedUsers;
	}
	
	@GetMapping("/getPermittedUsers/{classroomUid}")
	public ResponseEntity<?> getPermittedUsers(@PathVariable String classroomUid, 
			                                   @AuthenticationPrincipal UserDetailsImpl userDetails){
		Classroom classroom = classroomRepository.findByUid(classroomUid)
                .orElseThrow(() -> new RuntimeException("Classroom Uid not found"));
		if(classroom.getAdmin().getId() != userDetails.getId()){
			return ResponseEntity.badRequest().body(MessageResponseConstants.USER_HAVE_NO_PERMISSION);
		}
		
		return ResponseEntity.ok().body(new GetUserPermissionsResponse(classroom.getAllowAll(), 
				                        retrievePermittedUsernamesFromUsersSet(classroom.getPermittedUsers())));
	}
	
	private List<String> retrievePermittedUsernamesFromUsersSet(Set<User> permittedUsers){
		List<String> permittedUsernames = new ArrayList<>();
		for(User permittedUser: permittedUsers){
			permittedUsernames.add(permittedUser.getUsername());
		}
		return permittedUsernames;
	}
	
	@GetMapping("/isUserPermitted/{classroomUid}")
	public ResponseEntity<?> isUserPermitted(@NotNull @PathVariable String classroomUid,
			                                 @AuthenticationPrincipal UserDetailsImpl userDetails){
		if(!classroomRepository.existsByUid(classroomUid)) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse(MessageResponseConstants.CLASSROOM_UID_NOT_EXISTS));
		}
		Classroom classroom = classroomRepository.findByUid(classroomUid).get();
		
		if(classroom.getAdmin().getId() == userDetails.getId() || 
		   isUserIdPresentInPermittedSet(classroom.getPermittedUsers(), userDetails.getId()) ||
		   classroom.getAllowAll()) {
				return ResponseEntity.ok().body(new MessageResponse(MessageResponseConstants.USER_PERMITTED_CLASSROOM));
		}
		
		return ResponseEntity.badRequest().body(new MessageResponse(MessageResponseConstants.USER_NOT_PERMITTED_CLASSROOM));
	}
	
	private boolean isUserIdPresentInPermittedSet(Set<User> permittedUsers, Long userId){
		for(User permittedUser: permittedUsers){
			if(permittedUser.getId() == userId) return true;
		}
		return false;
	}
	
}
