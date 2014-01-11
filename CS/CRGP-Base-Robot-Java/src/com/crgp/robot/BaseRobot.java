package com.crgp.robot;

import com.crgp.game.client.Client;
import com.crgp.robot.action.PlayAction;
import com.crgp.robot.action.UIDAction;

public abstract class BaseRobot {
	protected Client client;

	public BaseRobot() {
		try {
			client = new Client(UID());
			client.registAction("play", new PlayAction(this));
			client.registAction("UID", new UIDAction(this));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// -------------------------
	// ---
	// ---信号与槽(Signal and Slots)
	// ---
	// -------------------------
	/**
	 * [SLOT] 机器人名字
	 * 
	 * @return 机器人名字
	 */
	public abstract String UID();

	/**
	 * [SLOT] 执行机器人代码
	 * 
	 * @param code
	 *            回调标识
	 * 
	 */
	public abstract void play(int code);

}