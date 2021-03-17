package com.codeoffice.common.exception;

public class RdmException extends RuntimeException implements WithTypeException{
  
  private static final long serialVersionUID = 1L;

  private Type type;
  
  public RdmException(String message) {
    super(message);
    this.type = Type.LACK_PARAMTER;
  }

  public RdmException(Type type, String message) {
    super(message);
    this.type = type;
  }
  
  public  Type type(){
    return type;
  }

  
  public enum Type{
    WRONG_PAGE_NUM,LACK_PARAMTER,USER_NOT_LOGIN,USER_NOT_FOUND,USER_AUTH_FAIL,TOKEN_CHECK_FAILED,SHARED_TOKEN_ANALYSIS_ERROR,SHARE_SERIAL_INVALID,STR_ENCRY_ERROR
    ,STR_DEENCRY_ERROR,SHARE_TOKEN_CHECK_FAILED,ILLEGAL_PARAMS,DATABASE_INDEX_IS_NULL;
  }

}
