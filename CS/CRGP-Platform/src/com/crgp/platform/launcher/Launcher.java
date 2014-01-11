package com.crgp.platform.launcher;

import com.crgp.platform.gui.MainWindow;
import com.crgp.platform.xml.XMLReader;
import com.crgp.platform.xml.bean.GameBean;

/**
 * 启动器
 * 
 * @author XJiang
 * 
 */
public class Launcher {
	public static void main(String[] args) {
		try {
			GameBean gameLaunchBean = XMLReader.readGameLaunchBean();

			MainWindow window = new MainWindow(gameLaunchBean);

			window.setVisible(true);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}