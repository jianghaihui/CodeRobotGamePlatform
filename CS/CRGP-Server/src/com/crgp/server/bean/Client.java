package com.crgp.server.bean;

import java.net.Socket;

public class Client {
	private String UID;
	private Socket socket;

	public Client() {
	}

	public Client(String UID, Socket socket) {
		super();
		this.UID = UID;
		this.socket = socket;
	}

	public String getUID() {
		return UID;
	}

	public void setUID(String UID) {
		this.UID = UID;
	}

	public Socket getSocket() {
		return socket;
	}

	public void setSocket(Socket socket) {
		this.socket = socket;
	}

}
