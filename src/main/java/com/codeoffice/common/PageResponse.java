package com.codeoffice.common;

import com.github.pagehelper.Page;
import com.google.common.collect.Lists;
import lombok.Data;
import org.apache.commons.collections.CollectionUtils;

import java.io.Serializable;
import java.util.List;

/**
 * 分页Response
 */
@Data
public class PageResponse<T> implements Serializable {

    private static final long serialVersionUID = 8574664034527782038L;

    /**
     * 当前页
     */
    private int current = 1;
    /**
     * 每页显示记录数
     */
    private int pageSize = 20;
    /**
     * 总页数
     */
    private int totalPage = 0;

    /**
     * 总记录数
     */
    private long total = 0;

    /**
     * 结果集
     */
    private List<T> data;


    public PageResponse() {
        this.data = Lists.newArrayList();
    }

    public PageResponse(Page page, List<T> list) {
        if (page != null && CollectionUtils.isNotEmpty(list)) {
            this.current = page.getPageNum();
            this.pageSize = page.getPageSize();
            this.data = list;
            this.total = page.getTotal();
            this.totalPage = page.getPages();
        }
    }

    public PageResponse(int current, int pageSize, int total, int totalPage, List<T> list) {
        this.current = current;
        this.pageSize = pageSize;
        this.data = list;
        this.total = total;
        this.totalPage = totalPage;
    }
}
