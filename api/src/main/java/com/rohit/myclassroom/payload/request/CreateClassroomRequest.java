package com.rohit.myclassroom.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateClassroomRequest {
	
	@NotBlank
	@Size(min=2, max=35)
	private String name;
	
	@Size(min=0, max=250)
	private String description;
}

