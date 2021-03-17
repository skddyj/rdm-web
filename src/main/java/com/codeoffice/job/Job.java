package com.codeoffice.job;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2020/12/1 13:59
 */
@Data
public class Job {

    public enum Status{
        TODO,
        COMPLETED
    }

    public Job(){

    }

    public Job(final Long id,final String node,final Status status){
        this.id=id;
        this.node=node;
        this.status=status;
    }

    private Long id;

    private Status status;

    private String node;

}
