package com.xjiang.mine.robot;

import java.util.Map;

import com.crgp.game.client.message.ActionMessage;
import com.crgp.game.client.message.DataMessage;
import com.crgp.game.client.message.Message;
import com.crgp.robot.BaseRobot;

public abstract class MineRobot extends BaseRobot {
	public static final String GAME_UID = "CRGP-Mine-Game";

	@Override
	public String GameUID() {
		return GAME_UID;
	}

	@Override
	public final synchronized Map<String, String> play(int code) {
		return play();
	}

	/**
	 * 每次需要机器人点击一个雷点的时候会调用该方法;<BR>
	 * 该方法需要返回一个点击位置<BR>
	 * 返回的方式为:<BR>
	 * Map.put("x",x)
	 * Map.put("y",y)
	 */
	public abstract Map<String, String> play();

	// -------------------------
	// ---
	// ---信号与槽(Signal and Slots)
	// ---
	// -------------------------
	/**
	 * [SIGNAL]获得宽度值
	 * 
	 * @return
	 */
	public final int getWidth() {
		// 构建求情消息
		ActionMessage actionMessage = new ActionMessage(Message.TYPE_ROBOT,
				RobotUID(), Message.TYPE_GAME, GAME_UID);
		actionMessage.setActionName("getWidth");
		actionMessage.setHasReceipt(true);

		// 发送消息并获取结果数据
		DataMessage dataMessage = client.send(actionMessage);

		// 解析结果数据
		return Integer.parseInt(dataMessage.getData("width"));
	}

	/**
	 * [SIGNAL]获得高度值
	 * 
	 * @return
	 */
	public final int getHeight() {
		// 构建求情消息
		ActionMessage actionMessage = new ActionMessage(Message.TYPE_ROBOT,
				RobotUID(), Message.TYPE_GAME, GAME_UID);
		actionMessage.setActionName("getHeight");
		actionMessage.setHasReceipt(true);

		// 发送消息并获取结果数据
		DataMessage dataMessage = client.send(actionMessage);

		// 解析结果数据
		return Integer.parseInt(dataMessage.getData("height"));
	}

	/**
	 * [SIGNAL]获得地雷总数
	 * 
	 * @return
	 */
	public final int getMineCount() {
		// 构建求情消息
		ActionMessage actionMessage = new ActionMessage(Message.TYPE_ROBOT,
				RobotUID(), Message.TYPE_GAME, GAME_UID);
		actionMessage.setActionName("getMineCount");
		actionMessage.setHasReceipt(true);

		// 发送消息并获取结果数据
		DataMessage dataMessage = client.send(actionMessage);

		// 解析结果数据
		return Integer.parseInt(dataMessage.getData("mineCount"));
	}

	/**
	 * [SIGNAL]获取所有位置的信息，以二维数组的形式返回
	 * 
	 * @return -1:未知,0-N:该位置的值
	 */
	public final int[][] getMap() {
		// 构建求情消息
		ActionMessage actionMessage = new ActionMessage(Message.TYPE_ROBOT,
				RobotUID(), Message.TYPE_GAME, GAME_UID);
		actionMessage.setActionName("getMap");
		actionMessage.setHasReceipt(true);

		// 发送消息并获取结果数据
		DataMessage dataMessage = client.send(actionMessage);

		// 解析结果数据
		String tmp1 = dataMessage.getData("map");
		tmp1 = tmp1.substring(1, tmp1.length() - 1);

		String as1[] = tmp1.split("\\|");
		int[][] arrays = new int[as1.length][];
		for (int i = 0; i < as1.length; i++) {
			String tmp2 = as1[i];
			tmp2 = tmp2.substring(1, tmp2.length() - 1);

			String as2[] = tmp2.split(",");
			arrays[i] = new int[as2.length];
			for (int j = 0; j < as2.length; j++) {
				arrays[i][j] = Integer.parseInt(as2[j].trim());
			}
		}
		return arrays;
	}
}
