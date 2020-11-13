package com.rohit.myclassroom.payload.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
	
	@NotBlank
	@Size(min = 2, max = 15)
	private String firstName;
	
	@NotBlank
	@Size(min = 2, max = 15)
	private String lastName;
	
	@NotBlank
	@Size(max = 20)
	private String username;
	
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;
        
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}
