package com.saialekhya.expense_tracker.controller;

import com.saialekhya.expense_tracker.entity.Expense;
import com.saialekhya.expense_tracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return service.saveExpense(expense);
    }

    @GetMapping
    public List<Expense> getExpenses() {
        return service.getAllExpenses();
    }

    // ADD THIS SECTION HERE

    @PutMapping("/{id}")
    public Expense updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense) {

        return service.updateExpense(id, expense);
    }

    // EXISTING DELETE METHOD

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        service.deleteExpense(id);
    }
}