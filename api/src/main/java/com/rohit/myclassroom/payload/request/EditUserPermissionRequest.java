package com.rohit.myclassroom.payload.request;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditUserPermissionRequest {
	@NotNull
	public String classroomUid;
	public Boolean allowAll;
	public List<String> permittedUsernames;
}
