package com.crgp.game;

import java.util.Map;

import javax.swing.JPanel;

import com.crgp.game.client.Client;
import com.crgp.game.client.message.ActionMessage;
import com.crgp.game.client.message.Message;

public abstract class BaseGame {
	protected String[] robots;

	protected Client client;

	public BaseGame() {
		try {
			client = new Client(UID());
		} catch (Exception e) {
			e.printStackTrace();
		}
		robots = new String[playerCount()];
	}

	/**
	 * 返回机器人列表
	 * 
	 * @return
	 */
	public String[] getRobots() {
		return robots;
	}

	/**
	 * 返回游戏名
	 * 
	 * @return
	 */
	public abstract String getName();

	/**
	 * 返回游戏UID
	 * 
	 * @return
	 */
	public abstract String UID();

	/**
	 * 返回游戏需要的玩家数量
	 * 
	 * @return
	 */
	public abstract int playerCount();

	/**
	 * 返回游戏主界面
	 * 
	 * @return
	 */
	public abstract JPanel createView();

	/**
	 * 启动游戏
	 * 
	 * @param params
	 */
	public abstract void launch(Map<String, String> params);

	public abstract void run(final long space, final long step);

	public abstract void runOne();

	public abstract boolean isEnd();

	// -------------------------
	// ---
	// ---信号与槽(Signal and Slot)
	// ---
	// -------------------------
	/**
	 * [SIGNAL]要求机器人发送执行代码
	 * 
	 * @param code
	 */
	public synchronized void play(String robotUID, int code) {
		ActionMessage actionMessage = new ActionMessage(
				Message.SOURCE_TYPE_GAME, UID(), Message.SOURCE_TYPE_ROBOT,
				robotUID);
		actionMessage.setActionName("play");
		actionMessage.addParam("code", code + "");
		actionMessage.setHasReceipt(false);

		client.send(actionMessage);
	}
}