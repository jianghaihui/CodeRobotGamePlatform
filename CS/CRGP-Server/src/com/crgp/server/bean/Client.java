package com.crgp.server.bean;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class Client {
	private String UID;
	private Socket socket;

	private InputStream IS;
	private OutputStream OS;

	public Client() {
	}

	public Client(String UID, Socket socket) {
		super();
		this.UID = UID;
		this.socket = socket;

		try {
			IS = socket.getInputStream();
			OS = socket.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}
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
		try {
			IS = socket.getInputStream();
			OS = socket.getOutputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public InputStream getIS() {
		return IS;
	}

	public OutputStream getOS() {
		return OS;
	}
}
