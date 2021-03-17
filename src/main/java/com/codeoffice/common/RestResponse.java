package com.codeoffice.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonInclude(Include.NON_NULL)
public class RestResponse<T> implements Serializable {

    private static final long serialVersionUID = 6337931479349920496L;

    private int code;
    private boolean success;
    private String message;
    private T result;

    public RestResponse() {
    }

    public RestResponse(boolean success, int code, String message, T result) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.result = result;
    }

    public static <T> RestResponse<T> success(T result) {
        return new RestResponse<T>(true, RestCode.OK.code, RestCode.OK.message, result);
    }

    public static <T> RestResponse<T> success() {
        return RestResponse.success(null);
    }

    public static <T> RestResponse<T> error(RestCode code) {
        return new RestResponse<T>(false, code.code, code.message, null);
    }

    public static <T> RestResponse<T> error(int code, String msg) {
        return new RestResponse<T>(false, code, msg, null);
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    @Override
    public String toString() {
        return "RestResponse [code=" + code + ", message=" + message + ", result=" + result + "]";
    }

}
