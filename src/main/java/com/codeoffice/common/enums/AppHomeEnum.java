package com.codeoffice.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

public enum AppHomeEnum{
    ;
    /**
     * 首页状态:1-未绑定，2-已绑定
     */
    public static enum HomeStatus{
        NOT_BIND(new Byte("1"),"未绑定"),
        BIND(new Byte("2"),"已绑定"),
        ;
        private Byte val;
        private String desc;

        HomeStatus(Byte val, String desc) {
            this.val = val;
            this.desc = desc;
        }

        public Byte getVal() {
            return val;
        }

        public String getDesc() {
            return desc;
        }
    }

    public static enum DeviceType{
        ANDROID(new Byte("1"),"android"),
        IOS(new Byte("2"),"ios"),
        WP(new Byte("3"),"WP"),
        UNKNOW(new Byte("4"),"未知设备"),
        ;
        private Byte val;
        private String name;

        DeviceType(Byte val, String name) {
            this.val = val;
            this.name = name;
        }

        public Byte getVal() {
            return val;
        }

        public String getName() {
            return name;
        }

        public static DeviceType getDeviceType(Byte val){
            DeviceType[] values = DeviceType.values();
            for (DeviceType d:values) {
                if(d.val.equals(val)){
                    return d;
                }
            }
            return UNKNOW;
        }

        public static DeviceType getDeviceType(String name){
            DeviceType[] values = DeviceType.values();
            for (DeviceType d:values) {
                if(d.name.equalsIgnoreCase(name)){
                    return d;
                }
            }
            return UNKNOW;
        }
    }

    /**
     * 首页产品tab类型
     */
    public static enum ProductTabType{
        SHE(1,"她"),
        NEXT_GENERATION(2,"下一代"),
        MY_HOME(3,"我的一家"),
        ;
        private Integer val;
        private String name;

        ProductTabType(Integer val, String name) {
            this.val = val;
            this.name = name;
        }

        public Integer getVal() {
            return val;
        }

        public String getName() {
            return name;
        }

        public static ProductTabType getProductTabType(Integer val){
            ProductTabType[] values = ProductTabType.values();
            for (ProductTabType d:values) {
                if(d.val.equals(val)){
                    return d;
                }
            }
            return null;
        }
    }

    /**
     * 产品类型，1-VIP，2-标品，3-系列
     */
    public static enum ProductType{
        VIP(1,"VIP"),
        STANDARD(2,"标品"),
        SERIES(3,"系列"),
        ;
        private Integer val;
        private String name;

        ProductType(Integer val, String name) {
            this.val = val;
            this.name = name;
        }

        public Integer getVal() {
            return val;
        }

        public String getName() {
            return name;
        }

        public static ProductType getProductType(Integer val){
            ProductType[] values = ProductType.values();
            for (ProductType d:values) {
                if(d.val.equals(val)){
                    return d;
                }
            }
            return null;
        }
    }

    /**
     * 通用变迁类型
     */
    @AllArgsConstructor
    @Getter
    public static enum UserLabelType{

        INTREST(1,"兴趣标签"),
        SEX(2,"性别标签"),
        LEVEL(3,"阶段标签"),
        ;
        private Integer type;
        private String desc;
    }
}
