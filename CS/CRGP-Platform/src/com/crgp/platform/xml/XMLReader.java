package com.crgp.platform.xml;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.crgp.platform.xml.bean.GameBean;
import com.crgp.platform.xml.bean.RobotBean;

@SuppressWarnings("unchecked")
public class XMLReader {
	public static RobotBean[] readRobotList() throws Exception {
		RobotBean[] robotList;

		InputStream in = null;
		in = new FileInputStream(new File("RobotList.xml"));
		SAXReader saxReader = new SAXReader();
		Document document = saxReader.read(in);
		// 将整个GameLauncher.xml文件解析出来
		Element _root = document.getRootElement();

		// 提取XML中的Param记录
		String xpath = "//Robot";
		List<Element> paramNodes = _root.selectNodes(xpath);

		robotList = new RobotBean[paramNodes.size()];

		for (int i = 0; i < robotList.length; i++) {
			Element element = paramNodes.get(i);
			RobotBean bean = new RobotBean();
			bean.setUID(element.attributeValue("UID"));
			robotList[i] = bean;
		}

		in.close();
		return robotList;
	}

	public static GameBean readGameLaunchBean() throws Exception {

		GameBean gameLauncherBean = new GameBean();
		InputStream in = null;
		in = new FileInputStream(new File("GameLauncher.xml"));
		SAXReader saxReader = new SAXReader();
		Document document = saxReader.read(in);
		// 将整个GameLauncher.xml文件解析出来
		Element _root = document.getRootElement();

		gameLauncherBean.setLaunchClass(_root.attribute("launchClass")
				.getValue());

		// 提取XML中的Param记录
		String xpath = "//Param";
		List<Element> paramNodes = _root.selectNodes(xpath);
		for (Element element : paramNodes) {
			gameLauncherBean.putParam(element.attributeValue("name"), element
					.attributeValue("value"));
		}

		in.close();

		return gameLauncherBean;
	}
}
