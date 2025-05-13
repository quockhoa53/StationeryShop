package com.example.office_management.activity.product;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.widget.Button;
import android.widget.TextView;

import com.example.office_management.R;

import java.util.ArrayList;
import java.util.List;

public class ProductActivity extends AppCompatActivity {

    private RecyclerView rvProductCategories;
    private RecyclerView rvProductAds;
    private TextView tvCategoryHeader;
    private Button btnPopular, btnBestSelling, btnNewArrivals, btnPrice;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product);

        // Initialize views
        rvProductCategories = findViewById(R.id.rvProductCategories);
        rvProductAds = findViewById(R.id.rvProductAds);
        btnPopular = findViewById(R.id.btnPopular);
        btnBestSelling = findViewById(R.id.btnBestSelling);
        btnNewArrivals = findViewById(R.id.btnNewArrivals);
        btnPrice = findViewById(R.id.btnPrice);

        // Setup RecyclerViews
        setupRecyclerViews();

        // Setup button listeners for sorting/filtering
        setupButtonListeners();
    }

    private void setupRecyclerViews() {
        // Setup Product Categories RecyclerView
        rvProductCategories.setLayoutManager(new LinearLayoutManager(this));
        List<String> categories = new ArrayList<>();
        categories.add("English Books");
        categories.add("Sách Tiếng Việt");
        CategoryAdapter categoryAdapter = new CategoryAdapter(categories);
        rvProductCategories.setAdapter(categoryAdapter);

        // Setup Product Ads RecyclerView
        rvProductAds.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));
        List<String> ads = new ArrayList<>();
        ads.add("Ad 1");
        ads.add("Ad 2");
        AdAdapter adAdapter = new AdAdapter(ads);
        rvProductAds.setAdapter(adAdapter);
    }

    private void setupButtonListeners() {
        btnPopular.setOnClickListener(v -> sortProducts("popular"));
        btnBestSelling.setOnClickListener(v -> sortProducts("best_selling"));
        btnNewArrivals.setOnClickListener(v -> sortProducts("new_arrivals"));
        btnPrice.setOnClickListener(v -> sortProducts("price"));
    }

    private void sortProducts(String sortType) {
        // Placeholder for sorting logic
        // Update RecyclerView data based on sortType
    }

    // Placeholder CategoryAdapter class
    private class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.ViewHolder> {
        private List<String> categories;

        public CategoryAdapter(List<String> categories) {
            this.categories = categories;
        }

        @Override
        public ViewHolder onCreateViewHolder(android.view.ViewGroup parent, int viewType) {
            android.view.View view = android.view.LayoutInflater.from(parent.getContext())
                    .inflate(android.R.layout.simple_list_item_1, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            holder.textView.setText(categories.get(position));
        }

        @Override
        public int getItemCount() {
            return categories.size();
        }

        public class ViewHolder extends RecyclerView.ViewHolder {
            public TextView textView;

            public ViewHolder(android.view.View itemView) {
                super(itemView);
                textView = itemView.findViewById(android.R.id.text1);
            }
        }
    }

    // Placeholder AdAdapter class
    private class AdAdapter extends RecyclerView.Adapter<AdAdapter.ViewHolder> {
        private List<String> ads;

        public AdAdapter(List<String> ads) {
            this.ads = ads;
        }

        @Override
        public ViewHolder onCreateViewHolder(android.view.ViewGroup parent, int viewType) {
            android.view.View view = android.view.LayoutInflater.from(parent.getContext())
                    .inflate(android.R.layout.simple_list_item_1, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            holder.textView.setText(ads.get(position));
        }

        @Override
        public int getItemCount() {
            return ads.size();
        }

        public class ViewHolder extends RecyclerView.ViewHolder {
            public TextView textView;

            public ViewHolder(android.view.View itemView) {
                super(itemView);
                textView = itemView.findViewById(android.R.id.text1);
            }
        }
    }
}