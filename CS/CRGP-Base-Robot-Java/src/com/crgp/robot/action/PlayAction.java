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
	public Map<String, String> execute(final ActionMessage message)
			throws Exception {
		final Thread playThread = new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					Map<String, String> resultMap = robot.play(Integer
							.parseInt(message.getParam("code")));

					resultMap.put("code", message.getParam("code"));
					robot.playEnd(resultMap);
				} catch (Exception e) {
					System.err.println(message.getParam("code"));
					e.printStackTrace();
				}
			}
		});
		playThread.start();
		return null;
	}

}
