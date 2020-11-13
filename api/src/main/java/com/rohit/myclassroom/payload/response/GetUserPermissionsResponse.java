package com.rohit.myclassroom.payload.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter 
@Setter
public class GetUserPermissionsResponse {
	private Boolean allowAll;
	private List<String> permittedUsers;
}
