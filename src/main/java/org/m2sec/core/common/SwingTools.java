package org.m2sec.core.common;


import burp.api.montoya.MontoyaApi;
import burp.api.montoya.http.message.requests.HttpRequest;
import burp.api.montoya.http.message.responses.HttpResponse;
import burp.api.montoya.ui.editor.HttpRequestEditor;
import burp.api.montoya.ui.editor.HttpResponseEditor;
import org.apache.commons.text.StringEscapeUtils;

import javax.swing.*;
import javax.swing.text.JTextComponent;
import java.awt.*;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * @author: outlaws-bai
 * @date: 2024/7/9 22:29
 * @description:
 */

public class SwingTools {


    public static void changePanelStatus(Container panel, boolean target) {
        Component[] components = panel.getComponents();
        for (Component component : components) {
            if (component instanceof JPanel chile) {
                changePanelStatus(chile, target);
            } else if (component instanceof Box chile) {
                changePanelStatus(chile, target);
            } else if (component instanceof JScrollPane chile) {
                changePanelStatus(chile, target);
            } else if (component instanceof JViewport chile) {
                changePanelStatus(chile, target);
            } else if (!(component instanceof JLabel)) {
                component.setEnabled(target);
            }
        }
    }

    public static void changeComponentStatus(Component component, boolean target) {
        component.setEnabled(target);
    }


    public static void showErrorStackTraceDialog(MontoyaApi api, Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        String stackTrace = sw.toString();
        JOptionPane.showMessageDialog(api.userInterface().swingUtils().suiteFrame(), stackTrace, "Error",
            JOptionPane.ERROR_MESSAGE);
    }

    public static void showErrorMessageDialog(MontoyaApi api, String message) {
        JOptionPane.showMessageDialog(api.userInterface().swingUtils().suiteFrame(), message, "Error",
            JOptionPane.ERROR_MESSAGE);
    }

    public static void showInfoDialog(MontoyaApi api, String message) {
        JOptionPane.showMessageDialog(api.userInterface().swingUtils().suiteFrame(), message, "Info",
            JOptionPane.INFORMATION_MESSAGE);
    }


    public static boolean showConfirmDialog(MontoyaApi api, String message) {
        int result = JOptionPane.showConfirmDialog(api.userInterface().swingUtils().suiteFrame(), message, "Please " +
            "confirm again", JOptionPane.YES_NO_OPTION);
        return result == JOptionPane.YES_OPTION;
    }

    public static String showInputDialog(MontoyaApi api, String message) {
        return JOptionPane.showInputDialog(api.userInterface().swingUtils().suiteFrame(), message);
    }

    public static void showRequest(MontoyaApi api, HttpRequest request, boolean isEncrypt) {
        String temp = isEncrypt ? "Encrypted" : "Decrypted";
        HttpRequestEditor requestEditor = api.userInterface().createHttpRequestEditor();
        requestEditor.setRequest(request);
        JDialog dialog = new JDialog(api.userInterface().swingUtils().suiteFrame());
        dialog.setTitle(Constants.BURP_SUITE_EXT_NAME + " - " + temp + " Request");
        api.userInterface().applyThemeToComponent(dialog);
        dialog.getContentPane().add(requestEditor.uiComponent());
        dialog.setSize(888, 888);
        dialog.setLocationRelativeTo(api.userInterface().swingUtils().suiteFrame());
        dialog.setVisible(true);
    }

    public static void showResponse(MontoyaApi api, HttpResponse response, boolean isEncrypt) {
        String temp = isEncrypt ? "Encrypted" : "Decrypted";
        HttpResponseEditor responseEditor = api.userInterface().createHttpResponseEditor();
        responseEditor.setResponse(response);
        JDialog dialog = new JDialog(api.userInterface().swingUtils().suiteFrame());
        dialog.setTitle(Constants.BURP_SUITE_EXT_NAME + " - " + temp + " Response");
        api.userInterface().applyThemeToComponent(dialog);
        dialog.getContentPane().add(responseEditor.uiComponent());
        dialog.setSize(888, 888);
        dialog.setLocationRelativeTo(api.userInterface().swingUtils().suiteFrame());
        dialog.setVisible(true);
    }

    public static String renderSummary(String funcDesc, String link, String returnDocs, String... paramDescs) {
        StringBuilder retVal = new StringBuilder();
        retVal.append(funcDesc).append(String.format("<br><a href=\"%s\">code</a>", link)).append("<br><br>");
        for (String paramDesc : paramDescs) {
            retVal.append("@param ").append(StringEscapeUtils.escapeHtml4(paramDesc)).append("<br>");
        }
        retVal.append("<br>").append("@return ").append(StringEscapeUtils.escapeHtml4(returnDocs));
        return retVal.toString();
    }


    public static String renderLink(String funcDesc, String link) {
        return funcDesc + String.format("<br><a href=\"%s\">code</a>", link);
    }

    public static void patchSwingEnv() {
        JTextComponent.removeKeymap("RTextAreaKeymap");
        UIManager.put("RTextAreaUI.inputMap", null);
        UIManager.put("RTextAreaUI.actionMap", null);
        UIManager.put("RSyntaxTextAreaUI.inputMap", null);
        UIManager.put("RSyntaxTextAreaUI.actionMap", null);
    }


}
