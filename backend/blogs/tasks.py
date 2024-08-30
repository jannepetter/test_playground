from backend.celery import app


@app.task
def add(x, y):
    return x + y


@app.task
def subtask_a(param):
    """
    Dummy task.
    """
    return f"Task A processed {param}"


@app.task
def subtask_b(param):
    """
    Dummy task.
    """

    return f"Task B processed {param}"


@app.task
def create_tasks(main_param):
    """
    Dummy task creating more dummy tasks.
    """
    task1 = subtask_a.apply_async(args=[main_param], eta="2025")
    task2 = subtask_b.apply_async(args=[main_param], eta="2026")
    task3 = subtask_a.apply_async(args=[main_param], eta="2027")

    return {"task_ids": [task1.id, task2.id, task3.id]}
