package com.saialekhya.expense_tracker.service;

import com.saialekhya.expense_tracker.entity.Expense;
import com.saialekhya.expense_tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public Expense saveExpense(Expense expense) {
        return repository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    public void deleteExpense(Long id) {
        repository.deleteById(id);
    }
}