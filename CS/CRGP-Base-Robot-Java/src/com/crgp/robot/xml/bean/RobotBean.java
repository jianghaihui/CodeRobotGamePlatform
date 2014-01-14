package com.crgp.robot.xml.bean;

public class RobotBean {
	private String UID;
	private String launcher;

	public String getUID() {
		return UID;
	}

	public void setUID(String uID) {
		UID = uID;
	}

	public String getLauncher() {
		return launcher;
	}

	public void setLauncher(String launcher) {
		this.launcher = launcher;
	}

	@Override
	public String toString() {
		return UID;
	}
}
