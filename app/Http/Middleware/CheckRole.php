<?php

// app/Http/Middleware/CheckRole.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!auth()->user()->roles->contains('name', $role)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}