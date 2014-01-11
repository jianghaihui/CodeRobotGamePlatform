package com.crgp.robot.action;

import java.util.Map;

import com.crgp.game.client.Action;
import com.crgp.game.client.message.ActionMessage;
import com.crgp.robot.BaseRobot;

public class PlayAction extends Action {

	private BaseRobot robot;

	public PlayAction(BaseRobot robot) {
		this.robot = robot;
	}

	@Override
	public Map<String, String> execute(ActionMessage message) throws Exception {
		robot.play(Integer.parseInt(message.getParam("code")));
		return null;
	}

}