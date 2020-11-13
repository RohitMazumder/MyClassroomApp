package com.rohit.myclassroom.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rohit.myclassroom.models.User;
import com.rohit.myclassroom.payload.request.LoginRequest;
import com.rohit.myclassroom.payload.request.SignupRequest;
import com.rohit.myclassroom.payload.response.JwtResponse;
import com.rohit.myclassroom.payload.response.MessageResponse;
import com.rohit.myclassroom.payload.response.MessageResponseConstants;
import com.rohit.myclassroom.repository.UserRepository;
import com.rohit.myclassroom.security.jwt.JwtUtils;
import com.rohit.myclassroom.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		
		return ResponseEntity.ok(new JwtResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getUsername()));
		}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse(MessageResponseConstants.ERROR_EMAIL_TAKEN));
		}
		
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse(MessageResponseConstants.ERROR_USERNAME_TAKEN));
		}

		createNewUserAccount(signUpRequest);
		
		return ResponseEntity.ok(new MessageResponse(MessageResponseConstants.USER_REGISTRATION_SUCCESSFUL));
	}

	private void createNewUserAccount(SignupRequest signUpRequest) {
		User user = new User(signUpRequest.getFirstName(),
							 signUpRequest.getLastName(),
							 signUpRequest.getUsername(),
							 signUpRequest.getEmail(),
							 encoder.encode(signUpRequest.getPassword()));

		userRepository.save(user);
	}
}
