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

    // ADD THESE METHODS HERE

    public Expense getExpenseById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {

        Expense existingExpense = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        existingExpense.setTitle(updatedExpense.getTitle());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setCategory(updatedExpense.getCategory());
        existingExpense.setDate(updatedExpense.getDate());
        existingExpense.setDescription(updatedExpense.getDescription());

        return repository.save(existingExpense);
    }

}