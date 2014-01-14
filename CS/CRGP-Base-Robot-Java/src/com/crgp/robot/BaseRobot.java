package com.crgp.robot;

import java.util.Map;

import com.crgp.game.client.Client;
import com.crgp.game.client.message.ActionMessage;
import com.crgp.game.client.message.Message;
import com.crgp.robot.action.PlayAction;
import com.crgp.robot.action.UIDAction;

public abstract class BaseRobot {
	protected Client client;

	public void init() {
		try {
			client = new Client(RobotUID());
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
	 * [SLOT] 机器人ID
	 * 
	 * @return 机器人ID
	 */
	public abstract String RobotUID();

	/**
	 * [SLOT] 游戏ID
	 * 
	 * @return 游戏ID
	 */
	public abstract String GameUID();

	/**
	 * [SLOT] 执行机器人代码
	 * 
	 * @param code
	 *            回调标识
	 * 
	 */
	public abstract Map<String, String> play(int code);

	/**
	 * [SIGNAL]机器人代码执行结束
	 * 
	 * @param code
	 */
	public synchronized void playEnd(Map<String, String> resultMap) {
		ActionMessage actionMessage = new ActionMessage(Message.TYPE_ROBOT,
				RobotUID(), Message.TYPE_GAME, GameUID());
		actionMessage.setActionName("playEnd");
		actionMessage.setParams(resultMap);
		actionMessage.setHasReceipt(false);

		client.send(actionMessage);
	}

}
