package com.crgp.robot;

import com.crgp.robot.xml.XMLReader;
import com.crgp.robot.xml.bean.RobotBean;

public class RobotLauncher {
	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		// 获得机器人对象
		try {
			RobotBean[] robots = XMLReader.readRobotList();

			for (int i = 0; i < robots.length; i++) {
				RobotBean bean = robots[i];
				Class<BaseRobot> c = (Class<BaseRobot>) Class.forName((bean)
						.getLauncher());
				BaseRobot robot = c.newInstance();
				robot.init();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
