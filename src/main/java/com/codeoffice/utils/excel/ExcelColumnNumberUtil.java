package com.codeoffice.utils.excel;

/**
 * @author: DongYanJun
 * @date: 2020/11/25 10:48
 */
public class ExcelColumnNumberUtil {

    /**
     * Excel 列号转数字
     *
     * @param excelNum Excel 列号
     * @return 数字
     */
    public static int excelNum2Digit(String excelNum) {
        char[] chs = excelNum.toCharArray();
        int digit = 0;

        /*
         *   B*26^2 + C*26^1 + F*26^0
         * = ((0*26 + B)*26 + C)*26 + F
         */
        for (char ch : chs) {
            digit = digit * 26 + (ch - 'A' + 1);
        }
        return digit;
    }

    /**
     * 数字转 Excel 列号
     *
     * @param digit 数字
     * @return Excel 列号
     */
    public static String digit2ExcelNum(int digit) {
        /*
         * 找到 digit 所处的维度 len, 它同时表示字母的位数
         * power 表示 26^n, 这里 n 分别等于 1, 2, 3
         * pre 表示 前 n 个维度的总和, 即 26^1 + 26^2 + 26^3
         */
        int len = 0, power = 1, pre = 0;
        for (; pre < digit; pre += power) {
            power *= 26;
            len++;
        }
        // 确定字母位数
        char[] excelNum = new char[len];
        /*
         * pre 包含 digit 所处的维度
         * pre - power 则是 digit 前面的维度总和
         * digit 先减去前面维度和
         */
        digit -= pre - power;
        /*
         * 比较难以理解的是这里为什么要自减 1
         * 其实是相对 (digit / power + 'A') 这句代码来的
         * 本应该是 (digit / power + 'A' - 1),
         * digit / power 的结果是完整的维度个数, 它加上 'A' - 1 后需要再加一
         * 当最后剩下的 6 个加上 'A' - 1 是应当的, 不需要做修改
         * 而当 (digit / power + 'A') 中没有减 1 后,
         * digit / power 的结果不需要再加一了
         * 相对于 digit / power 的结果, 最后剩下的 6 需要减 1
         */
        digit--;
        for (int i = 0; i < len; i++) {
            power /= 26;
            excelNum[i] = (char) (digit / power + 'A');
            digit %= power;
        }
        return String.valueOf(excelNum);
    }
}
