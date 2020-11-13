package com.rohit.myclassroom.payload.response;

import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter 
@Setter
public class CreateClassroomResponse {
	@NotBlank
	private String uid;
}
