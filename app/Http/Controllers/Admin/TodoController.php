<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Todo;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    $posts = Todo::all();
        return Inertia::render('Admin/Dashboard/Index',[
            'posts' => $posts
        ]);
    }
    public function edit(Todo $todo)
    {
        return Inertia::render('Admin/Dashboard/Edit',[
            'todo' => $todo
        ]);
    }
    
    public function update(Request $request, Todo $todo)
    {
        $todo->update([
            'name' => $request->name,
        ]);
        return redirect()->route('admin.todo.index')->with('success', 'data todo berhasil diubah');
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'completed' => 'boolean',
        ]);

        Todo::create($data);

        return back()->with('success', 'data todo berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    

    /**
     * Update the specified resource in storage.
     */
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $todo->delete();

        return redirect()->route('admin.todo.index')->with('success', 'Data todo berhasil dihapus');
    }
}
