package com.codeoffice.utils.excel;

import org.apache.commons.text.StringSubstitutor;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;

import java.util.HashMap;
import java.util.Map;

/**
 * @author: DongYanJun
 * @date: 2020/11/25 11:54
 */
public class ExpressionUtil {

    public static void main(String[] args) {

        ExpressionParser expressionParser=new SpelExpressionParser();
        Expression e=expressionParser.parseExpression("1.2+2.3");
        System.out.println(e.getValue());

        String ss="\"abc\".contains("+"\"a\""+")";
        Expression e1=expressionParser.parseExpression(ss);
        System.out.println(e1.getValue());
        Expression e2=expressionParser.parseExpression("\"sss\".contains(\"sss\")");
        System.out.println(e2.getValue());

        Map valuesMap =new HashMap();
        valuesMap.put("animal", "quick brown fox");
        valuesMap.put("target", "lazy dog");
        String templateString = "The ${animal} jumped over the ${target}.";

        StringSubstitutor sub = new StringSubstitutor(valuesMap);
        String resolvedString = sub.replace(templateString);
        System.out.println(resolvedString);


    }
}
