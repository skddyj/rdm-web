package com.codeoffice.job;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class JobDao {

    // 模拟数据库中的数据
    private final  Map<Long, Job> data = new ConcurrentHashMap<>(200, 1);
    
    public JobDao() {
        // 初始化数据
        init();
    }
    
    private void init() {
        addData(0L, 100L, "node1");
        addData(100L, 200L, "node2");
    }
    
    private void addData(final long idFrom, final long idTo, final String location) {
        for (long i = idFrom; i < idTo; i++) {
            data.put(i, new Job(i, location, Job.Status.TODO));
        }
    }

    // 从数据库中获取数据
    public List<Job> findTodoData(final String node, final int limit) {
        System.out.println(data.hashCode());
        long todoCount = data.entrySet().stream().filter((e)-> e.getValue().getStatus().equals(Job.Status.TODO)).count();
        System.out.println("剩余未完成数量："+todoCount);
        // 模拟从数据库取任务 一次获取10条
        List<Job> result = new ArrayList<>(limit);
        int count = 0;
        for (Map.Entry<Long, Job> each : data.entrySet()) {
            Job job = each.getValue();
            if (job.getNode().equals(node) && job.getStatus() == Job.Status.TODO) {
                result.add(job);
                count++;
                if (count == limit) {
                    break;
                }
            }
        }
        return result;
    }

    // 更新数据库
    public void setCompleted(final long id) {
        data.get(id).setStatus(Job.Status.COMPLETED);
    }
}
