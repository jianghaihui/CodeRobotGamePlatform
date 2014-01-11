package com.crgp.platform.xml.bean;

public class RobotBean {
	private String name;
	private String classPath;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getClassPath() {
		return classPath;
	}

	public void setClassPath(String classPath) {
		this.classPath = classPath;
	}

	@Override
	public String toString() {
		return name;
	}
}
